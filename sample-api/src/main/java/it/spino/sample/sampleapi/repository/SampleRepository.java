package it.spino.sample.sampleapi.repository;

import it.spino.sample.sampleapi.domain.Sample;
import org.springframework.data.domain.Limit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SampleRepository  extends MongoRepository<Sample, Long> {
    List<Sample> findByUpdatedAtGreaterThanEqual(Instant updatedAt, Limit limit);
}