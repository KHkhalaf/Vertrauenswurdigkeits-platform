package com.backend.app.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.text.DecimalFormat;

@Document(collection = "umfrage")
public class Umfrage {
    @Id
    private String _id;
    private String unternehmenId;
    private String unternehmenName;
    private Boolean itSicherheitIOS;
    private Integer itSicherheitISMSStatus;
    private Double itSicherheitITSBudget;
    private String itSicherheitVulnTest;
    private String itSicherheitPriority;

    public Umfrage(String unternehmenId, String unternehmenName, Boolean itSicherheitIOS, Integer itSicherheitISMSStatus,
                   Double itSicherheitITSBudget, String itSicherheitVulnTest, String itSicherheitPriority) {
        this.unternehmenId = unternehmenId;
        this.unternehmenName = unternehmenName;
        this.itSicherheitIOS = itSicherheitIOS;
        this.itSicherheitISMSStatus = itSicherheitISMSStatus;
        this.itSicherheitITSBudget = itSicherheitITSBudget;
        this.itSicherheitVulnTest = itSicherheitVulnTest;
        this.itSicherheitPriority = itSicherheitPriority;
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

    public Boolean getItSicherheitIOS() {
        return itSicherheitIOS;
    }

    public Integer getItSicherheitISMSStatus() {
        return itSicherheitISMSStatus;
    }

    public Double getItSicherheitITSBudget() {
        return itSicherheitITSBudget;
    }

    public String getItSicherheitVulnTest() {
        return itSicherheitVulnTest;
    }

    public String getItSicherheitPriority() {
        return itSicherheitPriority;
    }
}