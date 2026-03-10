package com.bigbank.currency.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Taux de change entre deux devises")
public class ExchangeRate {

    @Schema(description = "Devise source", example = "EUR")
    private String from;

    @Schema(description = "Devise cible", example = "USD")
    private String to;

    @Schema(description = "Taux de conversion", example = "1.0856")
    private double rate;

    @Schema(description = "Montant original", example = "100.0")
    private double originalAmount;

    @Schema(description = "Montant converti", example = "108.56")
    private double convertedAmount;

    @Schema(description = "Horodatage de la conversion", example = "2025-01-15T10")
    private String timestamp;

}
