package com.backend.app.services;

import com.backend.app.models.Umfrage;
import com.backend.app.models.Unternehmen;
import com.backend.app.repositores.UnternehmenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnternehmenService {
    private final UnternehmenRepository unternehmenRepository;

    @Autowired
    public UnternehmenService(UnternehmenRepository unternehmenRepository){
        this.unternehmenRepository = unternehmenRepository;
    }
    public void insertBatch(List<Unternehmen> data) {
        this.unternehmenRepository.saveAll(data);
    }

    public Unternehmen findById(String Id) {
        return unternehmenRepository.findByUnternehmenId(Id);
    }

    public List<Unternehmen> findAll() {
        return unternehmenRepository.findAll();
    }
}
