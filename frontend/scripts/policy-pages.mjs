// Páginas de política (/terms, /privacy, /refund e /en/..., /fr/...): termos do relatório pago, privacidade e reembolso.
// Aparecem no rodapé do site e são o endereço das políticas da loja que o checkout da AbacatePay pode pedir.
// SUPPORT_EMAIL (variável de ambiente do build; padrão: o e-mail do projeto) é o contato publicado nas páginas; vazio, a página
// manda o pedido pela página de contato do projeto no GitHub, que é pública: não é canal para dados de pagamento.
import { siteHeader } from './site-header.mjs';
import { IDEOLOGIES_CSS } from './ideologies-index.mjs';
import { catalogHead } from './personalities-index.mjs';

const SUPPORT_EMAIL = (process.env.SUPPORT_EMAIL ?? '12axes.quiz@gmail.com').trim();
const ISSUES_URL = 'https://github.com/RomanCypherpunk/12axes/issues/new';
const UPDATED = { pt: '30 de outubro de 2026', en: 'October 30, 2026', fr: '30 octobre 2026' };
// Quem vende (identificação do fornecedor): aparece só na página de termos de uso. Dados públicos do MEI.
const SELLER = '69.892.973 ENZO XAVIER SANTOS (MEI), CNPJ 69.892.973/0001-89';

export const POLICY_SLUGS = ['report', 'terms', 'privacy', 'refund'];

const CONTACT = {
  pt: {
    email: (email) => `por e-mail em <a href="mailto:${email}">${email}</a>`,
    issues: `pela <a href="${ISSUES_URL}">página de contato do projeto no GitHub</a> (não publique dados de pagamento ali)`
  },
  en: {
    email: (email) => `by e-mail at <a href="mailto:${email}">${email}</a>`,
    issues: `through the <a href="${ISSUES_URL}">project contact page on GitHub</a> (do not post payment details there)`
  },
  fr: {
    email: (email) => `par e-mail à <a href="mailto:${email}">${email}</a>`,
    issues: `via la <a href="${ISSUES_URL}">page de contact du projet sur GitHub</a> (n’y publiez pas de données de paiement)`
  }
};

const contact = (locale) => (SUPPORT_EMAIL ? CONTACT[locale].email(SUPPORT_EMAIL) : CONTACT[locale].issues);

// Cada página: título, resumo, e uma lista de seções [título, [parágrafos ou itens]]. Itens começando com "- " viram lista.
const PAGES = {
  pt: {
    report: (c) => ({
      title: 'Relatório Completo',
      lead: 'Análise aprofundada do seu resultado político, em compra única, sem assinatura.',
      sections: [
        ['O que inclui', [
          '- <strong>Análise dos 12 eixos, um por um:</strong> o que a sua posição em cada eixo significa e o que mais pesou nas suas respostas.',
          '- <strong>Onde você mais discorda:</strong> da ideologia, da personalidade e do país mais próximos, eixo a eixo.',
          '- <strong>Seu governo ideal:</strong> nove cargos ocupados pelas figuras mais compatíveis com você.',
          '- <strong>Sua linha do tempo ideológica:</strong> os perfis mais próximos de cada era, da Antiguidade ao século XXI.',
          '- <strong>Para qual país se mudar:</strong> os 10 países atuais mais próximos dos seus ideais políticos.',
          '- <strong>Personalidades por área:</strong> a mais compatível com você em política, filosofia, economia e nas demais áreas.',
          '- <strong>Ranking completo, planilha e PDF:</strong> sua compatibilidade com todo o catálogo, para exportar para o Excel, e o relatório em PDF.'
        ]],
        ['Preço', ['R$ 14,99, em pagamento único por resultado. Sem assinatura e sem renovação automática.']],
        ['Como você recebe', ['O acesso é liberado no próprio site assim que o pagamento é confirmado, sem conta nem senha. Ele vale para o resultado comprado.']],
        ['Pagamento', ['O pagamento é feito por Pix, processado pela AbacatePay. O 12 Axes não recebe nem guarda dados de cartão.']],
        ['Reembolso', ['Reembolso integral em até 7 dias. Veja a <a href="/refund">política de reembolso</a> e os <a href="/terms">termos de uso</a>.']],
        ['Dúvidas', [`Fale conosco ${c}.`]]
      ]
    }),
    terms: (c) => ({
      title: 'Termos de uso',
      lead: 'Regras de uso do 12 Axes e do Relatório Completo.',
      sections: [
        ['O que é o 12 Axes', ['Quiz político independente e gratuito, que posiciona você em 12 eixos e o compara com ideologias, personalidades, países e partidos. É um conteúdo informativo e educativo: os resultados são aproximações e não representam a posição do autor nem aconselhamento de qualquer natureza.']],
        ['O Relatório Completo', [
          'Conteúdo digital adicional sobre um resultado específico, vendido por compra única, por resultado: o acesso vale para o resultado comprado (os 12 valores dos eixos), e outro resultado exige outra compra.',
          'Inclui análises e rankings completos do resultado e exportação em CSV e PDF. O que está incluído é mostrado antes do pagamento.',
          'O acesso é liberado no site assim que o pagamento é confirmado, e não depende de conta ou senha.'
        ]],
        ['Preço e pagamento', ['O preço é mostrado antes do pagamento. O pagamento é processado pela AbacatePay, por Pix, e o 12 Axes não recebe nem guarda dados de pagamento.']],
        ['Guardar o acesso', ['O acesso fica salvo no navegador usado na compra. Se você trocar de aparelho ou apagar os dados do navegador, peça a recuperação do acesso por e-mail, informando o e-mail usado no pagamento e o link do seu resultado.']],
        ['Reembolso', ['Você pode pedir o reembolso integral em até 7 dias da compra. Veja a política de reembolso.']],
        ['Mudanças', ['Estes termos podem mudar; a versão em vigor é a publicada nesta página, com a data de atualização.']],
        ['Quem vende', [`O Relatório Completo é vendido por ${SELLER}.`]],
        ['Contato', [`Dúvidas ${c}.`]]
      ]
    }),
    privacy: (c) => ({
      title: 'Política de privacidade',
      lead: 'Que dados o 12 Axes trata e para quê.',
      sections: [
        ['Respostas do quiz', ['As respostas são usadas só para calcular o resultado no momento em que você as envia. O 12 Axes não guarda respostas em banco de dados nem associa resultados a pessoas: o resultado fica codificado no endereço (link) da página.']],
        ['Pagamentos', [
          'O pagamento é feito na AbacatePay, que trata os dados do pagamento (nome, e-mail, documento, forma de pagamento) sob a política de privacidade dela. O 12 Axes não recebe nem guarda dados de cartão.',
          'Para liberar o relatório, o site consulta a AbacatePay para confirmar o pagamento e usa uma referência a ele, sem guardá-los em banco de dados.'
        ]],
        ['Armazenamento no seu navegador', ['O site guarda no seu navegador preferências (como idioma e tema), o último resultado e, quando há compra, o código de acesso ao relatório. Você pode apagar esses dados nas configurações do navegador.']],
        ['Análise de acesso', ['Usamos ferramentas de análise de tráfego, como o Google Analytics, para medir visitas e melhorar o site. Elas podem usar cookies e identificadores.']],
        ['Hospedagem', ['O site e a API usam provedores de infraestrutura (como Vercel, Cloudflare e Render) que processam os acessos para entregar o conteúdo.']],
        ['Seus direitos', [`Você pode pedir informação sobre dados pessoais tratados, correção ou eliminação, conforme a Lei Geral de Proteção de Dados (LGPD). Peça ${c}.`]]
      ]
    }),
    refund: (c) => ({
      title: 'Política de reembolso',
      lead: 'Reembolso integral em até 7 dias, no Brasil e no exterior.',
      sections: [
        ['Quem pode pedir', ['Qualquer comprador do Relatório Completo, no Brasil ou em outro país, por qualquer forma de pagamento (Pix ou cartão).']],
        ['Prazo', ['Até 7 dias corridos depois da compra. O reembolso é integral, sem perguntas.']],
        ['Como pedir', [`Peça ${c}, informando o e-mail usado no pagamento e, se tiver, a data da compra. Não envie número de cartão.`]],
        ['Como é devolvido', ['O valor volta pela mesma forma de pagamento, pela AbacatePay. O prazo para aparecer na fatura ou no banco depende da operadora do cartão ou do banco.']],
        ['O que acontece com o acesso', ['Depois do reembolso, o acesso ao relatório daquele resultado deixa de funcionar.']]
      ]
    })
  },
  en: {
    report: (c) => ({
      title: 'Full Report',
      lead: 'An in-depth analysis of your political result, as a one-time purchase with no subscription.',
      sections: [
        ['What is included', [
          '- <strong>Analysis of all 12 axes, one by one:</strong> what your position on each axis means and what weighed most in your answers.',
          '- <strong>Where you disagree most:</strong> with your closest ideology, figure and country, axis by axis.',
          '- <strong>Your ideal government:</strong> nine posts filled by the figures most compatible with you.',
          '- <strong>Your ideological timeline:</strong> the closest profiles of each era, from Antiquity to the 21st century.',
          '- <strong>Which country to move to:</strong> the 10 current countries closest to your political ideals.',
          '- <strong>Figures by field:</strong> the one most compatible with you in politics, philosophy, economics and the other fields.',
          '- <strong>Full ranking, spreadsheet and PDF:</strong> your compatibility with the whole catalog, to export to Excel, and the report as a PDF.'
        ]],
        ['Price', ['US$ 3.99, as a one-time payment per result. No subscription and no automatic renewal. Local taxes, where applicable, are calculated at checkout.']],
        ['How you receive it', ['Access is unlocked on this site as soon as payment is confirmed, with no account or password. It covers the result you bought.']],
        ['Payment', ['Orders are processed by Paddle.com Market Limited (“Paddle”), our Merchant of Record, which accepts cards and other payment methods depending on your country. 12 Axes does not receive or store card details.']],
        ['Refund', ['Full refund within 7 days. See the <a href="/en/refund">refund policy</a> and the <a href="/en/terms">terms of use</a>.']],
        ['Questions', [`Contact us ${c}.`]]
      ]
    }),
    terms: (c) => ({
      title: 'Terms of use',
      lead: 'Rules for using 12 Axes and the Full Report.',
      sections: [
        ['What 12 Axes is', ['An independent, free political quiz that places you on 12 axes and compares you with ideologies, figures, countries and parties. It is informational and educational content: results are approximations and do not represent the author’s position or advice of any kind.']],
        ['The Full Report', [
          'Additional digital content about one specific result, sold as a one-time purchase per result: access covers the result you bought (its 12 axis values), and another result needs another purchase.',
          'It includes in-depth analyses and full rankings of the result and CSV and PDF export. What is included is shown before payment.',
          'Access is unlocked on the site as soon as payment is confirmed and does not depend on an account or password.'
        ]],
        ['Price and payment', ['The price is shown before payment. Orders are processed by Paddle.com Market Limited (“Paddle”), our Merchant of Record: Paddle sells the report to you, collects applicable taxes and handles payment, invoices and refunds. 12 Axes does not receive or store card details.']],
        ['Keeping your access', ['Access is saved in the browser used for the purchase. If you switch devices or clear your browser data, ask for your access to be restored by e-mail, giving the e-mail used for the payment and the link to your result.']],
        ['Refund', ['You can ask for a full refund within 7 days of purchase. See the refund policy.']],
        ['Changes', ['These terms may change; the version in force is the one published on this page, with its update date.']],
        ['Who sells', [`The Full Report is sold to you by Paddle, our Merchant of Record, and provided by ${SELLER}.`]],
        ['Contact', [`Questions ${c}.`]]
      ]
    }),
    privacy: (c) => ({
      title: 'Privacy policy',
      lead: 'What data 12 Axes handles and why.',
      sections: [
        ['Quiz answers', ['Answers are used only to compute your result at the moment you submit them. 12 Axes does not store answers in a database or link results to people: the result is encoded in the page address (link).']],
        ['Payments', [
          'Payment is made on Paddle, our Merchant of Record, which handles payment data (name, e-mail, address, payment method) under its own privacy policy. 12 Axes does not receive or store card details.',
          'To unlock the report, the site queries Paddle to confirm the payment and uses a reference to it, without storing them in a database.'
        ]],
        ['Storage in your browser', ['The site stores preferences (such as language and theme), your last result and, after a purchase, the report access code in your browser. You can delete them in your browser settings.']],
        ['Analytics', ['We use traffic analytics tools, such as Google Analytics, to measure visits and improve the site. They may use cookies and identifiers.']],
        ['Hosting', ['The site and API use infrastructure providers (such as Vercel, Cloudflare and Render) that process requests to deliver content.']],
        ['Your rights', [`You can ask for information about personal data handled, correction or deletion, under the Brazilian General Data Protection Law (LGPD) and similar laws where you live. Ask ${c}.`]]
      ]
    }),
    refund: (c) => ({
      title: 'Refund policy',
      lead: 'Full refund within 7 days, in Brazil and abroad.',
      sections: [
        ['Who can ask', ['Any buyer of the Full Report, in Brazil or any other country, by any payment method (Pix or card).']],
        ['Deadline', ['Within 7 calendar days of purchase. The refund is in full, no questions asked.']],
        ['How to ask', [`Ask ${c}, giving the e-mail used for the payment and, if you have it, the purchase date. Do not send a card number.`]],
        ['How it is returned', ['The amount goes back through the same payment method, issued by Paddle, our Merchant of Record. How long it takes to show on your statement or bank depends on your card issuer or bank.']],
        ['What happens to your access', ['After the refund, access to the report for that result stops working.']]
      ]
    })
  },
  fr: {
    report: (c) => ({
      title: 'Rapport complet',
      lead: 'Une analyse approfondie de votre résultat politique, en achat unique, sans abonnement.',
      sections: [
        ['Ce qui est inclus', [
          '- <strong>Analyse des 12 axes, un par un :</strong> ce que signifie votre position sur chaque axe et ce qui a le plus pesé dans vos réponses.',
          '- <strong>Là où vous êtes le plus en désaccord :</strong> avec l’idéologie, la figure et le pays les plus proches, axe par axe.',
          '- <strong>Votre gouvernement idéal :</strong> neuf postes occupés par les figures les plus compatibles avec vous.',
          '- <strong>Votre frise idéologique :</strong> les profils les plus proches de chaque époque, de l’Antiquité au XXIe siècle.',
          '- <strong>Dans quel pays déménager :</strong> les 10 pays actuels les plus proches de vos idéaux politiques.',
          '- <strong>Figures par domaine :</strong> la plus compatible avec vous en politique, philosophie, économie et dans les autres domaines.',
          '- <strong>Classement complet, tableur et PDF :</strong> votre compatibilité avec tout le catalogue, à exporter vers Excel, et le rapport en PDF.'
        ]],
        ['Prix', ['3,99 $ US, en paiement unique par résultat. Sans abonnement et sans renouvellement automatique. Les taxes locales, le cas échéant, sont calculées au moment du paiement.']],
        ['Comment vous le recevez', ['L’accès est débloqué sur ce site dès que le paiement est confirmé, sans compte ni mot de passe. Il couvre le résultat acheté.']],
        ['Paiement', ['Les commandes sont traitées par Paddle.com Market Limited (« Paddle »), notre Merchant of Record, qui accepte les cartes et d’autres moyens de paiement selon votre pays. 12 Axes ne reçoit ni ne conserve les données de carte.']],
        ['Remboursement', ['Remboursement intégral sous 7 jours. Consultez la <a href="/fr/refund">politique de remboursement</a> et les <a href="/fr/terms">conditions d’utilisation</a>.']],
        ['Questions', [`Contactez-nous ${c}.`]]
      ]
    }),
    terms: (c) => ({
      title: 'Conditions d’utilisation',
      lead: 'Règles d’utilisation de 12 Axes et du Rapport complet.',
      sections: [
        ['Ce qu’est 12 Axes', ['Un quiz politique indépendant et gratuit qui vous situe sur 12 axes et vous compare à des idéologies, des figures, des pays et des partis. C’est un contenu informatif et éducatif : les résultats sont des approximations et ne représentent ni la position de l’auteur ni un conseil de quelque nature que ce soit.']],
        ['Le Rapport complet', [
          'Contenu numérique supplémentaire sur un résultat précis, vendu en achat unique par résultat : l’accès couvre le résultat acheté (ses 12 valeurs d’axes), et un autre résultat nécessite un autre achat.',
          'Il comprend des analyses approfondies et des classements complets du résultat, ainsi qu’une exportation CSV et PDF. Ce qui est inclus est affiché avant le paiement.',
          'L’accès est débloqué sur le site dès que le paiement est confirmé et ne dépend ni d’un compte ni d’un mot de passe.'
        ]],
        ['Prix et paiement', ['Le prix est affiché avant le paiement. Les commandes sont traitées par Paddle.com Market Limited (« Paddle »), notre Merchant of Record : Paddle vous vend le rapport, perçoit les taxes applicables et gère le paiement, les factures et les remboursements. 12 Axes ne reçoit ni ne conserve les données de carte.']],
        ['Conserver votre accès', ['L’accès est enregistré dans le navigateur utilisé pour l’achat. Si vous changez d’appareil ou effacez les données de votre navigateur, demandez la récupération de votre accès par e-mail, en indiquant l’e-mail utilisé pour le paiement et le lien de votre résultat.']],
        ['Remboursement', ['Vous pouvez demander un remboursement intégral dans les 7 jours suivant l’achat. Consultez la politique de remboursement.']],
        ['Modifications', ['Ces conditions peuvent changer ; la version en vigueur est celle publiée sur cette page, avec sa date de mise à jour.']],
        ['Qui vend', [`Le Rapport complet vous est vendu par Paddle, notre Merchant of Record, et fourni par ${SELLER}.`]],
        ['Contact', [`Pour toute question, contactez-nous ${c}.`]]
      ]
    }),
    privacy: (c) => ({
      title: 'Politique de confidentialité',
      lead: 'Quelles données 12 Axes traite et pourquoi.',
      sections: [
        ['Réponses au quiz', ['Les réponses servent uniquement à calculer votre résultat au moment où vous les envoyez. 12 Axes ne conserve pas les réponses dans une base de données et n’associe pas les résultats à des personnes : le résultat est encodé dans l’adresse (lien) de la page.']],
        ['Paiements', [
          'Le paiement s’effectue sur Paddle, notre Merchant of Record, qui traite les données de paiement (nom, e-mail, adresse, moyen de paiement) selon sa propre politique de confidentialité. 12 Axes ne reçoit ni ne conserve les données de carte.',
          'Pour débloquer le rapport, le site interroge Paddle afin de confirmer le paiement et utilise une référence à celui-ci, sans conserver ces informations dans une base de données.'
        ]],
        ['Stockage dans votre navigateur', ['Le site conserve dans votre navigateur vos préférences (comme la langue et le thème), votre dernier résultat et, après un achat, le code d’accès au rapport. Vous pouvez les supprimer dans les paramètres de votre navigateur.']],
        ['Analyse d’audience', ['Nous utilisons des outils d’analyse de trafic, comme Google Analytics, pour mesurer les visites et améliorer le site. Ils peuvent utiliser des cookies et des identifiants.']],
        ['Hébergement', ['Le site et l’API utilisent des fournisseurs d’infrastructure (comme Vercel, Cloudflare et Render) qui traitent les requêtes pour diffuser le contenu.']],
        ['Vos droits', [`Vous pouvez demander des informations sur les données personnelles traitées, leur rectification ou leur suppression, en vertu de la loi générale brésilienne sur la protection des données (LGPD) et de lois similaires là où vous vivez. Faites votre demande ${c}.`]]
      ]
    }),
    refund: (c) => ({
      title: 'Politique de remboursement',
      lead: 'Remboursement intégral sous 7 jours, au Brésil comme à l’étranger.',
      sections: [
        ['Qui peut demander', ['Tout acheteur du Rapport complet, au Brésil ou dans un autre pays, quel que soit le moyen de paiement (Pix ou carte).']],
        ['Délai', ['Dans les 7 jours calendaires suivant l’achat. Le remboursement est intégral, sans justification.']],
        ['Comment demander', [`Faites votre demande ${c}, en indiquant l’e-mail utilisé pour le paiement et, si vous l’avez, la date d’achat. N’envoyez pas de numéro de carte.`]],
        ['Comment c’est remboursé', ['Le montant est restitué par le même moyen de paiement, via Paddle, notre Merchant of Record. Le délai pour apparaître sur votre relevé ou votre banque dépend de l’émetteur de votre carte ou de votre banque.']],
        ['Ce qu’il advient de votre accès', ['Après le remboursement, l’accès au rapport de ce résultat cesse de fonctionner.']]
      ]
    })
  }
};

const LABELS = {
  pt: { report: 'Relatório Completo', terms: 'Termos de uso', privacy: 'Privacidade', refund: 'Reembolso', updated: 'Atualizado em', skip: 'Pular para o conteúdo', footer: 'Quiz político independente · 12axes.vercel.app · © 2026. Todos os direitos reservados' },
  en: { report: 'Full Report', terms: 'Terms of use', privacy: 'Privacy', refund: 'Refund', updated: 'Updated', skip: 'Skip to content', footer: 'Independent political quiz · 12axes.vercel.app · © 2026. All rights reserved' },
  fr: { report: 'Rapport complet', terms: 'Conditions d’utilisation', privacy: 'Confidentialité', refund: 'Remboursement', updated: 'Dernière mise à jour', skip: 'Aller au contenu', footer: 'Quiz politique indépendant · 12axes.vercel.app · © 2026. Tous droits réservés' }
};

function body(paragraphs, escapeHtml) {
  const html = [];
  let items = [];
  const flush = () => {
    if (items.length) {
      html.push(`<ul>${items.join('')}</ul>`);
      items = [];
    }
  };
  for (const text of paragraphs) {
    if (text.startsWith('- ')) {
      items.push(`<li>${text.slice(2)}</li>`);
    } else {
      flush();
      // O texto vem deste arquivo (confiável) e pode ter <a>; só as strings de conteúdo livre passariam por escapeHtml.
      html.push(`<p>${text}</p>`);
    }
  }
  flush();
  return html.join('');
}

/** Três páginas de política do idioma de L: /terms, /privacy e /refund (com o prefixo do idioma). */
export function policyPages(L, { site, gaSnippet, escapeHtml }) {
  const locale = L.locale;
  const labels = LABELS[locale];
  const prefix = L.s.prefix;

  return POLICY_SLUGS.map((slug) => {
    const basePath = `/${slug}`;
    const page = PAGES[locale][slug](contact(locale));
    const title = `${page.title} | 12 Axes`;
    const sections = page.sections
      .map(([heading, paragraphs]) => `<section><h2>${escapeHtml(heading)}</h2>${body(paragraphs, escapeHtml)}</section>`)
      .join('');
    const others = POLICY_SLUGS.filter((other) => other !== slug)
      .map((other) => `<a href="${prefix}/${other}">${escapeHtml(labels[other])}</a>`)
      .join(' · ');
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: `${site}${prefix}${basePath}`,
      inLanguage: L.s.htmlLang,
      isPartOf: { '@type': 'WebSite', name: '12 Axes', url: site }
    };
    const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title, description: page.lead, ogType: 'website', ogImage: '/logo.png', css: '/policy.css', jsonLd: [jsonLd], gaSnippet, escapeHtml })}
  <body>
<a class="skip" href="#conteudo">${escapeHtml(labels.skip)}</a>
${siteHeader({ L, basePath })}

<div class="wrap hero">
  <p class="crumbs"><a href="${prefix || '/'}">${escapeHtml(L.s.home)}</a> / ${escapeHtml(page.title)}</p>
  <h1>${escapeHtml(page.title)}</h1>
  <p class="lead">${escapeHtml(page.lead)}</p>
  <p class="updated">${escapeHtml(labels.updated)}: ${UPDATED[locale]}</p>
</div>

<main id="conteudo" class="wrap prose">
  ${sections}
  <p class="others">${others}</p>
</main>
<footer class="foot"><div class="wrap"><a class="logo" href="${prefix || '/'}"><b>12</b><span>axes</span></a><p>${escapeHtml(labels.footer)} · ${others}</p></div></footer>
</body>
</html>`;
    return { basePath, html };
  });
}

export const POLICY_CSS = `${IDEOLOGIES_CSS}
.updated{margin-top:14px;font-size:13px;color:var(--suave)}
.prose{max-width:760px;padding-bottom:72px}
.prose section{margin-top:34px}
.prose h2{font-family:var(--display);font-weight:600;font-size:22px;letter-spacing:-.02em;margin-bottom:8px}
.prose p,.prose li{color:var(--tinta);font-size:16px}
.prose p+p{margin-top:12px}
.prose ul{margin:10px 0 0 22px}
.prose a{color:var(--floresta);text-decoration:underline}
.prose .others{margin-top:44px;font-size:14px;color:var(--suave)}
.foot a{text-decoration:underline}
`;
