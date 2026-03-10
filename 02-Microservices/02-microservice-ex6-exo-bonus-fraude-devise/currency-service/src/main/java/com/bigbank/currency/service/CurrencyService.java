package com.bigbank.currency.service;

import com.bigbank.currency.model.ExchangeRate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class CurrencyService {

    private static final Map<String, Double> RATES_FROM_EUR = Map.ofEntries(
            Map.entry("USD", 1.0856),
            Map.entry("GBP", 0.8534),
            Map.entry("CHF", 0.9412),
            Map.entry("JPY", 162.35),
            Map.entry("CAD", 1.4723),
            Map.entry("AUD", 1.6542),
            Map.entry("CNY", 7.8234),
            Map.entry("MAD", 10.7845),
            Map.entry("TND", 3.3456),
            Map.entry("XOF", 655.957),
            Map.entry("RUB", 0.011)
    );

    public List<String> getSupportedCurrencies() {
        List<String> currencies = new ArrayList<>(RATES_FROM_EUR.keySet());
        currencies.add("EUR");
        Collections.sort(currencies);
        return currencies;
    }

    public Map<String, Double> getAllRates() {
        return RATES_FROM_EUR;
    }

    public ExchangeRate convert(String from, String to, double amount) {
        if(!from.equals("EUR") && !RATES_FROM_EUR.containsKey(from)) {
            throw new IllegalArgumentException("Devise non supportee : " + from);
        }
        if (!to.equals("EUR") && !RATES_FROM_EUR.containsKey(to)) {
            throw new IllegalArgumentException("Devise non supportee : " + to);
        }

        double rate;

        if (from.equals("EUR")) {
            rate = RATES_FROM_EUR.get(to);
        } else if (to.equals("EUR")) {
            rate = 1.0 / RATES_FROM_EUR.get(from);
        } else {
            double fromToEur = 1.0 / RATES_FROM_EUR.get(from);
            double eurToTarget = RATES_FROM_EUR.get(to);
            rate = fromToEur * eurToTarget;
        }

        double convertedAmount = Math.round(amount * rate * 100.00) / 100.00;

        return new ExchangeRate(
                from,
                to,
                Math.round(rate * 10000.0) / 10000.0,
                amount,
                convertedAmount,
                Instant.now().toString()
        );
    }
}
