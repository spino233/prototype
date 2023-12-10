package it.spino.sample.sampleapi.domain;

import it.spino.sample.sampleapi.model.SampleDTO;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document
public class Sample {
    @Id
    private long id;
    private String name;
    private String surname;
    private String age;
    private boolean _deleted;
    private String _rev;
    @LastModifiedDate
    private Instant updatedAt;

    public static SampleDTO toDTO(Sample sample) {
        SampleDTO sampleDTO = new SampleDTO();
        sampleDTO.setId(sample.getId());
        sampleDTO.setAge(sample.getAge());
        sampleDTO.set_deleted(sample.is_deleted());
        sampleDTO.setUpdatedAt(sample.getUpdatedAt().toEpochMilli());
        sampleDTO.setName(sample.getName());
        sampleDTO.setSurname(sample.getSurname());
        sampleDTO.set_rev(sample.get_rev());
        return sampleDTO;
    }
}