package com.backend.app.services;

import com.backend.app.models.Umfrage;
import com.backend.app.repositores.UmfrageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UmfrageService {
    private final UmfrageRepository umfrageRepository;

    @Autowired
    public UmfrageService(UmfrageRepository umfrageRepository){
        this.umfrageRepository = umfrageRepository;
    }
    public Umfrage findById(String Id) {
        return umfrageRepository.findByUnternehmenId(Id);
    }

    public List<Umfrage> findAll() {
        return umfrageRepository.findAll();
    }

    public void insertBatch(List<Umfrage> data) {
        this.umfrageRepository.saveAll(data);
    }
    public boolean isEmpty(){
        return this.umfrageRepository.count() == 0;
    }
}
