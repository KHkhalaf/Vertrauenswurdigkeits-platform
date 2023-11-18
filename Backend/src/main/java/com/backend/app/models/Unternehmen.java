package com.backend.app.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.text.DecimalFormat;

@Document(collection = "unternehmen")
public class Unternehmen {
    @Id
    private String _id;
    private String unternehmenId;
    private String unternehmenName;
    private Double unternehmenZutrauenScore;
    private Double unternehmenZuverlassigkeitScore;
    private Double unternehmenIntegritatScore;
    private Double unternehmenItSicherheitScore;
    private Double itLosungScore;
    private String unternehmenDescription;
    private String unternehmenLogo;

    public Unternehmen(String unternehmenId, String unternehmenName, Double unternehmenZutrauenScore,
                       Double unternehmenZuverlassigkeitScore, Double unternehmenIntegritatScore,
                       Double unternehmenItSicherheitScore, Double itLosungScore,
                       String unternehmenDescription, String unternehmenLogo) {
        this.unternehmenId = unternehmenId;
        this.unternehmenName = unternehmenName;
        this.unternehmenZutrauenScore = unternehmenZutrauenScore;
        this.unternehmenZuverlassigkeitScore = unternehmenZuverlassigkeitScore;
        this.unternehmenIntegritatScore = unternehmenIntegritatScore;
        this.unternehmenItSicherheitScore = unternehmenItSicherheitScore;
        this.itLosungScore = itLosungScore;
        this.unternehmenDescription = unternehmenDescription;
        this.unternehmenLogo = unternehmenLogo;
    }

    public String get_id() {
        return _id;
    }

    public String getUnternehmenId() {
        return unternehmenId;
    }

    public String getUnternehmenName() {
        return unternehmenName;
    }

    public Double getUnternehmenZutrauenScore() {
        return unternehmenZutrauenScore;
    }

    public Double getUnternehmenZuverlassigkeitScore() {
        return unternehmenZuverlassigkeitScore;
    }

    public Double getUnternehmenIntegritatScore() {
        return unternehmenIntegritatScore;
    }

    public Double getUnternehmenItSicherheitScore() {
        return unternehmenItSicherheitScore;
    }

    public Double getItLosungScore() {
        return itLosungScore;
    }

    public String getUnternehmenDescription() {
        return unternehmenDescription;
    }

    public String getUnternehmenLogo() {
        return unternehmenLogo;
    }
}
