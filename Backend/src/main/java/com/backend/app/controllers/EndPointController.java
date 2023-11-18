package com.backend.app.controllers;

import com.backend.app.models.Umfrage;
import com.backend.app.models.Unternehmen;
import com.backend.app.services.UmfrageService;
import com.backend.app.services.UnternehmenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api")
public class EndPointController {
    private UmfrageService umfrageService;
    private UnternehmenService unternehmenService;

    @Autowired
    public void UmfrageController(UmfrageService umfrageService,UnternehmenService unternehmenService) {
        this.umfrageService = umfrageService;
        this.unternehmenService = unternehmenService;
    }

    @GetMapping(value = "/umfrage/{id}", produces = "application/json")
    public ResponseEntity<Umfrage> findUmfrageById(@PathVariable String id) {
        Umfrage umfrage = umfrageService.findById(id);
        if (umfrage != null) {
            return ResponseEntity.ok(umfrage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/umfrage/all", produces = "application/json")
    public List<Umfrage> findAllUmfrage() {
        return umfrageService.findAll();
    }

    @GetMapping(value = "/unternehmen/{id}", produces = "application/json")
    public ResponseEntity<Unternehmen> findUnternehmenById(@PathVariable String id) {
        Unternehmen unternehmen = unternehmenService.findById(id);
        if (unternehmen != null) {
            return ResponseEntity.ok(unternehmen);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/unternehmen/all", produces = "application/json")
    public List<Unternehmen> findAllUnternehmen() {
        return unternehmenService.findAll();
    }
}
