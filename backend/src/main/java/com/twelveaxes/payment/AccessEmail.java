package com.twelveaxes.payment;

/**
 * O e-mail com o acesso ao relatorio comprado. A AbacatePay so vende em reais (texto em portugues); a Paddle so vende em
 * dolar, para o publico estrangeiro (texto em ingles, {@link #htmlEn}/{@link #textEn}).
 */
public final class AccessEmail {
    public static final String SUBJECT = "Seu relatório completo do 12 Axes";
    public static final String SUBJECT_EN = "Your full 12 Axes report";

    private AccessEmail() {
    }

    /** {@code link}: o endereco do resultado com o acesso no fragmento ({@code #access=...}). So tem caracteres seguros em HTML depois de escapar o '&'. */
    public static String html(String link) {
        String href = escape(link);
        return "<div style=\"font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1b1b1b\">"
                + "<h2 style=\"margin:0 0 12px\">Seu relatório completo está liberado</h2>"
                + "<p style=\"line-height:1.55\">Obrigado pela compra! Use o botão abaixo para abrir o seu relatório completo. "
                + "O link vale para o resultado que você pagou e abre em qualquer aparelho.</p>"
                + "<p style=\"margin:24px 0\"><a href=\"" + href + "\" style=\"background:#102e24;color:#ffffff;text-decoration:none;"
                + "padding:14px 24px;border-radius:999px;display:inline-block;font-weight:bold\">Abrir meu relatório</a></p>"
                + "<p style=\"line-height:1.55;font-size:14px;color:#555\">Guarde este e-mail: o link é o seu acesso ao relatório. "
                + "Não o compartilhe em público.</p>"
                + "<p style=\"line-height:1.55;font-size:14px;color:#555\">Qualquer problema, é só responder esta mensagem.</p>"
                + "<p style=\"font-size:14px;color:#555\">Equipe 12 Axes</p></div>";
    }

    public static String text(String link) {
        return "Seu relatório completo do 12 Axes está liberado.\n\n"
                + "Abra o seu relatório por este link (vale para o resultado que você pagou e abre em qualquer aparelho):\n"
                + link + "\n\n"
                + "Guarde este e-mail: o link é o seu acesso ao relatório. Não o compartilhe em público.\n"
                + "Qualquer problema, é só responder esta mensagem.\n\n"
                + "Equipe 12 Axes\n";
    }

    /** Mesmo conteudo de {@link #html}, em ingles, para os compradores da Paddle. */
    public static String htmlEn(String link) {
        String href = escape(link);
        return "<div style=\"font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1b1b1b\">"
                + "<h2 style=\"margin:0 0 12px\">Your full report is unlocked</h2>"
                + "<p style=\"line-height:1.55\">Thanks for your purchase! Use the button below to open your full report. "
                + "The link works for the result you paid for and opens on any device.</p>"
                + "<p style=\"margin:24px 0\"><a href=\"" + href + "\" style=\"background:#102e24;color:#ffffff;text-decoration:none;"
                + "padding:14px 24px;border-radius:999px;display:inline-block;font-weight:bold\">Open my report</a></p>"
                + "<p style=\"line-height:1.55;font-size:14px;color:#555\">Keep this email: the link is your access to the report. "
                + "Don't share it publicly.</p>"
                + "<p style=\"line-height:1.55;font-size:14px;color:#555\">Any trouble, just reply to this message.</p>"
                + "<p style=\"font-size:14px;color:#555\">The 12 Axes team</p></div>";
    }

    public static String textEn(String link) {
        return "Your full 12 Axes report is unlocked.\n\n"
                + "Open your report with this link (it works for the result you paid for and opens on any device):\n"
                + link + "\n\n"
                + "Keep this email: the link is your access to the report. Don't share it publicly.\n"
                + "Any trouble, just reply to this message.\n\n"
                + "The 12 Axes team\n";
    }

    private static String escape(String link) {
        return link.replace("&", "&amp;").replace("\"", "&quot;");
    }
}
