package it.spino.sample.sampleapi.rest;

import it.spino.sample.sampleapi.domain.Sample;
import it.spino.sample.sampleapi.model.SampleDTO;
import it.spino.sample.sampleapi.repository.SampleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Limit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/sample")
@RequiredArgsConstructor
@Slf4j
public class SampleController {
    private final SampleRepository repo;

    @GetMapping("/sync")
    public ResponseEntity<List<SampleDTO>> sync(@RequestParam(required = false, defaultValue = "0") long updatedAt,
                                                @RequestParam(required = false, defaultValue = "0") int limit) {
        Instant instant = Instant.ofEpochMilli(updatedAt);
        return ResponseEntity.ok(repo.findByUpdatedAtGreaterThanEqual(
                        instant, Limit.of(limit))
                .stream()
                .map(Sample::toDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<List> addAll(@RequestBody List<Sample> samples) {
        log.info("called post");
        log.info("{}", samples);
        repo.saveAll(samples);
        return ResponseEntity.ok(new ArrayList<>());
    }
}