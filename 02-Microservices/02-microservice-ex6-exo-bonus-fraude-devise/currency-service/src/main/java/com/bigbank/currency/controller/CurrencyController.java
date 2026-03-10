package com.bigbank.currency.controller;

import com.bigbank.currency.model.ExchangeRate;
import com.bigbank.currency.service.CurrencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/currency")
@Tag(name = "Currency", description = "Conversion de devises et taux de change")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping("/rates")
    @Operation(
            summary = "Tous les taux de change",
            description = "Retourne les taux de change actuels par rapport a l'EUR"
    )
    public Map<String, Object> getRates(){
        return Map.of(
                "base", "EUR",
                "rates", currencyService.getAllRates(),
                "currencies", currencyService.getSupportedCurrencies()
        );
    }

    @GetMapping("/currencies")
    @Operation(
            summary = "Devises supportees",
            description = "Liste de toutes les devises disponibles pour la conversion"
    )
    public Map<String, Object> getCurrencies(){
        List<String> currencies = currencyService.getSupportedCurrencies();
        return Map.of(
                "currencies", currencies,
                "count", currencies.size()
        );
    }

    @GetMapping("/convert")
    @Operation(
            summary = "Convertir un montant",
            description = "Convertit un montant d'une devise source vers une devise cible. "
                    + "La conversion utilise l'EUR comme devise pivot."
    )
    public ResponseEntity<?> convert(
        @Parameter(description = "Devise source (ex: EUR)", required = true)
        @RequestParam String from,

        @Parameter(description = "Devise cible (ex: USD)", required = true)
        @RequestParam String to,

        @Parameter(description = "Montant a convertir", required = true)
        @RequestParam double amount
    ) {
        try {
            ExchangeRate result = currencyService.convert(from.toUpperCase(), to.toUpperCase(), amount);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @GetMapping("/health")
    @Operation(
            summary = "Health check",
            description = "Vérifie que le service est operationnel"
    )
    public Map<String, String> health(){
        return Map.of(
        "status", "UP",
        "service", "currency-service"
        );
    }
}