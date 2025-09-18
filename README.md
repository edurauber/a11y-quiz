# a11y-quiz
Roteiro Interativo de Acessibilidade Web: Uma ferramenta de checklist para auditorias detalhadas, focada na perspectiva de usuários de leitores de tela e baseada nas normas WCAG 2.2 e ABNT 17225.

Roteiro Interativo de Inspeção de Acessibilidade Web
Uma ferramenta de checklist interativo para auditorias de acessibilidade web, desenvolvida com foco na metodologia e na experiência de especialistas que utilizam leitores de tela e navegação por teclado. O roteiro é baseado nas diretrizes do 

WCAG (Web Content Accessibility Guidelines) 2.2 e nas recomendações da 

norma brasileira ABNT NBR 17225:2025.

Acesso à Ferramenta
➡️ Acesse e utilize a ferramenta aqui!

(Substitua seu-usuario e seu-repositorio pelos seus dados do GitHub)

Índice
Motivação

Principais Funcionalidades

Como Utilizar

Tecnologias Utilizadas

Como Contribuir

Licença

Motivação
A maioria dos checklists de acessibilidade são documentos estáticos (PDFs, planilhas) que não foram projetados para serem ferramentas de trabalho fluidas. Este projeto nasceu da necessidade de criar um roteiro que fosse:

Interativo: Permitindo o preenchimento direto na página.

Otimizado para Não-Visuais: Com perguntas e uma estrutura pensada para a metodologia de teste de um auditor com deficiência visual.

Eficiente: Gerando um relatório detalhado e compartilhável ao final da inspeção, otimizando o tempo de documentação.

O objetivo é fornecer uma ferramenta prática que auxilie desenvolvedores, testadores (QAs) e especialistas em acessibilidade a realizar auditorias mais precisas e eficazes.

Principais Funcionalidades
✅ Checklist Interativo: Responda aos critérios de verificação diretamente na interface web.

📜 

Baseado em Normas: As perguntas são fundamentadas nos critérios de sucesso do WCAG 2.2 e na norma brasileira ABNT NBR 17225:2025.

📄 Geração de Relatório: Ao finalizar, a ferramenta consolida todas as não conformidades e observações em um relatório detalhado e sumário.

🔗 Link Compartilhável: Exporte os resultados completos da auditoria em um único link, utilizando compressão de dados para garantir que mesmo relatórios com muitas observações possam ser compartilhados facilmente.

🧑‍💻 Foco na Perspectiva Não-Visual: As perguntas foram refinadas para serem acionáveis e verificáveis por um especialista que navega primariamente via teclado e leitores de tela.

📱 Interface Responsiva: Utilize a ferramenta em desktops, tablets ou smartphones.

Como Utilizar
Acesse o link da ferramenta.

Navegue pelas seções e articles que representam os diferentes critérios de acessibilidade.

Responda a cada verificação marcando "Conforme", "Não Conforme" ou "Não se Aplica".

Adicione suas anotações e observações nos campos de texto correspondentes a cada seção.

Ao concluir, clique em "Finalizar Inspeção" no final da página para gerar o relatório.

Utilize os botões de ação para Copiar o relatório em texto simples, Imprimir ou Gerar um Link Compartilhável com todos os dados da sua auditoria.

Tecnologias Utilizadas
Este projeto foi construído com o objetivo de ser leve, rápido e sem dependências desnecessárias.

HTML5 Semântico: Para garantir uma estrutura acessível e robusta.

CSS3: Para a estilização, incluindo layout responsivo e um modo de impressão otimizado.

JavaScript (ES6+): Para toda a interatividade, geração do relatório e a lógica de compartilhamento por link, sem o uso de frameworks.

Pako.js: Uma biblioteca de compressão (DEFLATE) utilizada para compactar os dados do relatório no link compartilhável, garantindo a robustez da funcionalidade.

Como Contribuir
Este é um projeto de código aberto e contribuições são muito bem-vindas! Se você tiver ideias para novas funcionalidades, melhorias nas perguntas ou correções de bugs, siga os passos abaixo:

Faça um "Fork" deste repositório.

Crie uma nova "Branch" para sua funcionalidade (git checkout -b feature/minha-feature).

Faça suas alterações e "commits" (git commit -m 'Adiciona minha-feature').

Envie para a sua Branch (git push origin feature/minha-feature).

Abra um "Pull Request".

Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE.md para mais detalhes. Isso significa que você pode usar, modificar e distribuir o código livremente, desde que mantenha os créditos originais.


