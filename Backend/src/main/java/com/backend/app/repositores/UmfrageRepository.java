package com.backend.app.repositores;

import com.backend.app.models.Umfrage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UmfrageRepository extends MongoRepository<Umfrage, String> {
    public Umfrage findByUnternehmenId(String UnternehmenId);
}
