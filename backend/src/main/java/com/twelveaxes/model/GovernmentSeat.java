package com.twelveaxes.model;

/**
 * Um cargo do governo ideal do usuario.
 *
 * @param seatKey cargo: lider, vice, economia, educacao, estrategia, filosofia, social, industria ou cultura
 * @param category categoria de personalidade que ocupa o cargo (politico, economista, intelectual...)
 * @param holder personalidade mais compativel daquela categoria
 */
public record GovernmentSeat(String seatKey, String category, PersonalityMatch holder) {
}
