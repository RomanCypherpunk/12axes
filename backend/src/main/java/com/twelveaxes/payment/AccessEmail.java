package com.twelveaxes.payment;

/** O e-mail com o acesso ao relatorio comprado (a AbacatePay so vende em reais, entao o texto e em portugues). */
public final class AccessEmail {
    public static final String SUBJECT = "Seu relatório completo do 12 Axes";

    private AccessEmail() {
    }

    /** {@code link}: o endereco do resultado com o acesso no fragmento ({@code #access=...}). So tem caracteres seguros em HTML depois de escapar o '&'. */
    public static String html(String link) {
        String href = link.replace("&", "&amp;").replace("\"", "&quot;");
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
}
