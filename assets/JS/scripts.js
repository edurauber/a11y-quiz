function preencherFormularioPelaURL() {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');

    // Se não houver o parâmetro 'data', não faz nada
    if (!dataParam) {
        return;
    }

    try {
        // 1. Decodifica a string Base64 para uma string binária
        const binaryString = atob(decodeURIComponent(dataParam));

        // 2. Converte a string binária de volta para um array de bytes (Uint8Array)
        const compressedData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            compressedData[i] = binaryString.charCodeAt(i);
        }

        // 3. Descomprime os dados usando pako
        const jsonString = pako.inflate(compressedData, { to: 'string' });

        // 4. Converte a string JSON de volta para um objeto
        const dataObject = JSON.parse(jsonString);

        const form = document.getElementById('inspection-form');

        // 5. Preenche o formulário usando os dados do objeto
        for (const name in dataObject) {
            if (Object.prototype.hasOwnProperty.call(dataObject, name)) {
                const value = dataObject[name];
                const radioInputs = form.querySelectorAll(`input[type="radio"][name="${name}"]`);
                const textarea = form.querySelector(`textarea[name="${name}"]`);

                if (radioInputs.length > 0) {
                    const inputToSelect = form.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
                    if (inputToSelect) {
                        inputToSelect.checked = true;
                    }
                } else if (textarea) {
                    textarea.value = value;
                }
            }
        }

        // 6. Dispara o evento de submit para gerar o relatório automaticamente
        form.requestSubmit();

    } catch (error) {
        console.error("Erro ao tentar ler os dados do link:", error);
        alert("Não foi possível carregar os dados do link. O link pode estar corrompido ou em um formato inválido.");
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inspection-form');
    const reportOutput = document.getElementById('report-output');
    const clearButton = document.getElementById('clear-button');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const now = new Date();
            const timestamp = now.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

            let findings = [];
            form.querySelectorAll('.verification-point').forEach(point => {
                const checkedRadio = point.querySelector('input[type="radio"]:checked');
                if (checkedRadio && checkedRadio.value !== 'Não se Aplica') {
                    const article = point.closest('article');
                    const notesTextarea = article.querySelector('textarea');

                    const legendElement = point.querySelector('legend');
                    const legendClone = legendElement.cloneNode(true);
                    const spanToRemove = legendClone.querySelector('.wcag-ref');
                    if (spanToRemove) {
                        spanToRemove.remove();
                    }
                    const cleanLegendText = legendClone.textContent.trim();

                    findings.push({
                        title: article.querySelector('h3').textContent,
                        legend: cleanLegendText,
                        result: checkedRadio.value,
                        notes: notesTextarea ? notesTextarea.value.trim() : '',
                        wcag: {
                            sc: point.dataset.wcagSc || 'N/A',
                            name: point.dataset.wcagName || 'Não especificado',
                            level: point.dataset.wcagLevel || 'N/A',
                            url: point.dataset.wcagUrl || '#'
                        }
                    });
                }
            });

            reportOutput.innerHTML = '';

            if (findings.length === 0) {
                reportOutput.innerHTML = '<p>Nenhum item foi preenchido para gerar o relatório.</p>';
                return;
            }

            const reportContainer = document.createElement('div');
            reportContainer.className = 'report-container';
            reportContainer.innerHTML = `<div class="report-header"><h2>Relatório de Auditoria de Acessibilidade</h2><p>Gerado em: ${timestamp}</p></div>`;

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'report-actions';
            actionsContainer.innerHTML = `<button id="copy-button">Copiar (Texto Simples)</button>
                                                  <button id="print-button">Imprimir Relatório</button>
                                                  <button id="share-button">Gerar Link Compartilhável</button>
                                                  <span class="visually-hidden" aria-live="assertive"></span>`;
            reportContainer.appendChild(actionsContainer);

            const nonConformantFindings = findings.filter(f => f.result === 'Não Conforme');
            const summarySection = document.createElement('div');
            summarySection.className = 'report-summary';
            summarySection.innerHTML = `<h3>Sumário de Não Conformidades (${nonConformantFindings.length})</h3>`;

            if (nonConformantFindings.length > 0) {
                const summaryList = document.createElement('ul');
                nonConformantFindings.forEach(finding => {
                    const item = document.createElement('li');
                    item.textContent = `${finding.title} - ${finding.legend} (Critério ${finding.wcag.sc})`;
                    summaryList.appendChild(item);
                });
                summarySection.appendChild(summaryList);
            } else {
                summarySection.innerHTML += '<p>Nenhuma não conformidade encontrada.</p>';
            }
            reportContainer.appendChild(summarySection);

            const detailsSection = document.createElement('div');
            detailsSection.className = 'report-details';
            detailsSection.innerHTML = `<h3>Relatório Detalhado</h3>`;

            const notesByTitle = findings.reduce((acc, f) => { if (f.notes) acc[f.title] = f.notes; return acc; }, {});
            const processedTitles = new Set();

            findings.forEach(finding => {
                if (!processedTitles.has(finding.title)) {
                    const titleFindings = findings.filter(f => f.title === finding.title);
                    const articleDiv = document.createElement('div');
                    titleFindings.forEach(f => {
                        articleDiv.innerHTML += `
                                <div class="finding">
                                    <h4>${f.title} - ${f.legend}</h4>
                                    <p class="finding-result ${f.result.replace(/\s/g, '-')}"><strong>Resultado:</strong> ${f.result}</p>
                                    <div class="finding-wcag">
                                        <strong>Critério WCAG:</strong> <a href="${f.wcag.url}" target="_blank">${f.wcag.sc} ${f.wcag.name} (Nível ${f.wcag.level})</a>
                                    </div>
                                </div>`;
                    });
                    if (notesByTitle[finding.title]) {
                        articleDiv.innerHTML += `<div class="finding-notes"><strong>Observações Gerais sobre ${finding.title}:</strong><blockquote>${notesByTitle[finding.title].replace(/\n/g, '<br>')}</blockquote></div>`;
                    }
                    detailsSection.appendChild(articleDiv);
                    processedTitles.add(finding.title);
                }
            });
            reportContainer.appendChild(detailsSection);
            reportOutput.appendChild(reportContainer);

            reportOutput.querySelector('#print-button').addEventListener('click', () => window.print());
            const shareButton = reportOutput.querySelector('#share-button');
            if (shareButton) {
                shareButton.addEventListener('click', function () {
                    gerarLinkCompartilhavel(this);
                });
            }
            reportOutput.querySelector('#copy-button').addEventListener('click', () => {
                const plainText = reportContainer.innerText;
                const copyButton = reportOutput.querySelector('#copy-button');
                const copyStatus = reportOutput.querySelector('[aria-live="assertive"]');
                navigator.clipboard.writeText(plainText).then(() => {
                    copyButton.textContent = 'Copiado!';
                    copyStatus.textContent = 'Relatório copiado para a área de transferência.';
                    setTimeout(() => {
                        copyButton.textContent = 'Copiar (Texto Simples)';
                        copyStatus.textContent = '';
                    }, 3000);
                });
            });

            const reportHeading = reportOutput.querySelector('h2');
            if (reportHeading) { reportHeading.tabIndex = -1; reportHeading.focus(); }
        });
    }

    // --- LÓGICA DO MODAL (INÍCIO) ---
    const modal = document.getElementById('confirm-modal');
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');
    const closeBtn = document.getElementById('confirm-close');
    let lastFocused = null;

    function openModal() {
        lastFocused = document.activeElement;
        modal.classList.remove('modal--hidden');
        modal.setAttribute('aria-hidden', 'false');
        yesBtn.focus();
        document.addEventListener('keydown', handleKeydown);
    }

    function closeModal() {
        modal.classList.add('modal--hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', handleKeydown);
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
        if (e.key === 'Tab') {
            const focusable = Array.from(modal.querySelectorAll('button'));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        }
    }

    if (clearButton) { clearButton.addEventListener('click', openModal); }
    if (yesBtn) { yesBtn.addEventListener('click', () => { form.reset(); reportOutput.innerHTML = ''; closeModal(); }); }
    if (noBtn) { noBtn.addEventListener('click', closeModal); }
    if (closeBtn) { closeBtn.addEventListener('click', closeModal); }
    // --- LÓGICA DO MODAL (FIM) ---

    // --- LÓGICA DO BOTÃO VOLTAR AO TOPO ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    const mainTitle = document.querySelector('.page-title h1');

    window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (mainTitle) {
            mainTitle.focus();
        }
    });

    function gerarLinkCompartilhavel(shareButton) {
        const form = document.getElementById('inspection-form');
        const formData = new FormData(form);
        const dataObject = {};

        for (const [name, value] of formData.entries()) {
            if (value.trim() !== '') {
                dataObject[name] = value;
            }
        }

        const jsonString = JSON.stringify(dataObject);
        const compressedData = pako.deflate(jsonString);
        const base64String = btoa(String.fromCharCode.apply(null, compressedData));
        const baseUrl = window.location.origin + window.location.pathname;
        const shareableLink = `${baseUrl}?data=${encodeURIComponent(base64String)}`;

        // LÓGICA DE CÓPIA E FEEDBACK ---

        // 1. Usa a API Clipboard para copiar o link
        navigator.clipboard.writeText(shareableLink).then(() => {

            const originalButtonText = shareButton.textContent;
            shareButton.textContent = 'Link Copiado!';
            shareButton.disabled = true; // Desabilita para evitar cliques múltiplos

            // 3. Fornece feedback para leitores de tela usando a região aria-live existente
            const copyStatus = document.querySelector('.report-actions .visually-hidden[aria-live="assertive"]');
            if (copyStatus) {
                copyStatus.textContent = 'Link compartilhável copiado para a área de transferência.';
            }

            setTimeout(() => {
                shareButton.textContent = originalButtonText;
                shareButton.disabled = false;
                if (copyStatus) {
                    copyStatus.textContent = '';
                }
            }, 3000);

        }).catch(err => {
            console.error('Falha ao copiar o link: ', err);
            prompt("Não foi possível copiar automaticamente. Por favor, copie o link abaixo:", shareableLink);
        });
    }
    preencherFormularioPelaURL();
});
