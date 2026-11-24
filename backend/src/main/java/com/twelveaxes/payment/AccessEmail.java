package com.twelveaxes.payment;

import java.util.Locale;
import java.util.Map;

/**
 * O e-mail com o acesso ao relatorio comprado, no idioma que a pessoa usava na pagina de resultado no momento da
 * compra ({@code lang}, gravado no pagamento pelo gateway). Qualquer idioma sem texto proprio (ou {@code lang} nulo)
 * cai no ingles, que e o publico mais amplo fora do Brasil.
 */
public final class AccessEmail {
    private static final String DEFAULT_LANG = "en";

    private record Texts(String subject, String title, String intro, String button, String keep, String trouble, String team) {
    }

    private static final Map<String, Texts> TEXTS = Map.of(
            "pt", new Texts(
                    "Seu relatório completo do 12 Axes",
                    "Seu relatório completo está liberado",
                    "Obrigado pela compra! Use o botão abaixo para abrir o seu relatório completo. O link vale para o resultado que você pagou e abre em qualquer aparelho.",
                    "Abrir meu relatório",
                    "Guarde este e-mail: o link é o seu acesso ao relatório. Não o compartilhe em público.",
                    "Qualquer problema, é só responder esta mensagem.",
                    "Equipe 12 Axes"),
            "en", new Texts(
                    "Your full 12 Axes report",
                    "Your full report is unlocked",
                    "Thanks for your purchase! Use the button below to open your full report. The link works for the result you paid for and opens on any device.",
                    "Open my report",
                    "Keep this email: the link is your access to the report. Don't share it publicly.",
                    "Any trouble, just reply to this message.",
                    "The 12 Axes team"),
            "es", new Texts(
                    "Tu informe completo de 12 Axes",
                    "Tu informe completo está desbloqueado",
                    "¡Gracias por tu compra! Usa el botón de abajo para abrir tu informe completo. El enlace es válido para el resultado que pagaste y se abre en cualquier dispositivo.",
                    "Abrir mi informe",
                    "Guarda este correo: el enlace es tu acceso al informe. No lo compartas en público.",
                    "Si tienes algún problema, solo responde a este mensaje.",
                    "El equipo de 12 Axes"),
            "de", new Texts(
                    "Dein vollständiger 12-Axes-Bericht",
                    "Dein vollständiger Bericht ist freigeschaltet",
                    "Danke für deinen Kauf! Nutze den Button unten, um deinen vollständigen Bericht zu öffnen. Der Link gilt für das Ergebnis, das du bezahlt hast, und funktioniert auf jedem Gerät.",
                    "Meinen Bericht öffnen",
                    "Bewahre diese E-Mail auf: Der Link ist dein Zugang zum Bericht. Teile ihn nicht öffentlich.",
                    "Bei Problemen antworte einfach auf diese Nachricht.",
                    "Das 12-Axes-Team"),
            "it", new Texts(
                    "Il tuo report completo di 12 Axes",
                    "Il tuo report completo è sbloccato",
                    "Grazie per il tuo acquisto! Usa il pulsante qui sotto per aprire il tuo report completo. Il link è valido per il risultato che hai pagato e si apre su qualsiasi dispositivo.",
                    "Apri il mio report",
                    "Conserva questa email: il link è il tuo accesso al report. Non condividerlo pubblicamente.",
                    "In caso di problemi, rispondi semplicemente a questo messaggio.",
                    "Il team di 12 Axes"),
            "ru", new Texts(
                    "Ваш полный отчёт 12 Axes",
                    "Ваш полный отчёт разблокирован",
                    "Спасибо за покупку! Нажмите на кнопку ниже, чтобы открыть полный отчёт. Ссылка действительна для результата, за который вы заплатили, и открывается на любом устройстве.",
                    "Открыть мой отчёт",
                    "Сохраните это письмо: ссылка — это ваш доступ к отчёту. Не делитесь ею публично.",
                    "Если возникнут проблемы, просто ответьте на это сообщение.",
                    "Команда 12 Axes"),
            "fr", new Texts(
                    "Votre rapport complet 12 Axes",
                    "Votre rapport complet est débloqué",
                    "Merci pour votre achat ! Utilisez le bouton ci-dessous pour ouvrir votre rapport complet. Le lien est valable pour le résultat que vous avez payé et s'ouvre sur n'importe quel appareil.",
                    "Ouvrir mon rapport",
                    "Conservez cet e-mail : le lien est votre accès au rapport. Ne le partagez pas publiquement.",
                    "En cas de problème, répondez simplement à ce message.",
                    "L'équipe 12 Axes")
    );

    private AccessEmail() {
    }

    private static Texts textsFor(String lang) {
        String key = lang == null ? "" : lang.trim().toLowerCase(Locale.ROOT);
        return TEXTS.getOrDefault(key, TEXTS.get(DEFAULT_LANG));
    }

    public static String subject(String lang) {
        return textsFor(lang).subject();
    }

    /**
     * O link do e-mail: o endereco do resultado com o acesso em {@code ?access=...}. Nao vai no fragmento ({@code #access=}) porque
     * o rastreamento de cliques de e-mail, os leitores de e-mail e os navegadores embutidos costumam perder o fragmento no
     * redirecionamento, e o comprador caia no resultado sem o relatorio. O front tira o parametro do endereco assim que le.
     */
    public static String link(String resultUrl, String token) {
        String separator = resultUrl.contains("?") ? "&" : "?";
        return resultUrl + separator + "access=" + java.net.URLEncoder.encode(token, java.nio.charset.StandardCharsets.UTF_8);
    }

    /** {@code link}: o endereco do resultado com o acesso ({@link #link}). So tem caracteres seguros em HTML depois de escapar o '&'. */
    public static String html(String lang, String link) {
        Texts t = textsFor(lang);
        String href = escape(link);
        return "<div style=\"font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1b1b1b\">"
                + "<h2 style=\"margin:0 0 12px\">" + t.title() + "</h2>"
                + "<p style=\"line-height:1.55\">" + t.intro() + "</p>"
                + "<p style=\"margin:24px 0\"><a href=\"" + href + "\" style=\"background:#102e24;color:#ffffff;text-decoration:none;"
                + "padding:14px 24px;border-radius:999px;display:inline-block;font-weight:bold\">" + t.button() + "</a></p>"
                + "<p style=\"line-height:1.55;font-size:14px;color:#555\">" + t.keep() + "</p>"
                + "<p style=\"line-height:1.55;font-size:14px;color:#555\">" + t.trouble() + "</p>"
                + "<p style=\"font-size:14px;color:#555\">" + t.team() + "</p></div>";
    }

    public static String text(String lang, String link) {
        Texts t = textsFor(lang);
        return t.title() + ".\n\n"
                + t.intro() + "\n"
                + link + "\n\n"
                + t.keep() + "\n"
                + t.trouble() + "\n\n"
                + t.team() + "\n";
    }

    private static String escape(String link) {
        return link.replace("&", "&amp;").replace("\"", "&quot;");
    }
}
