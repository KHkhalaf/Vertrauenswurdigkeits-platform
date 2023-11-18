package com.backend.app.repositores;

import com.backend.app.models.Umfrage;
import com.backend.app.models.Unternehmen;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnternehmenRepository extends MongoRepository<Unternehmen, String> {
    public Unternehmen findByUnternehmenId(String UnternehmenId);
}
