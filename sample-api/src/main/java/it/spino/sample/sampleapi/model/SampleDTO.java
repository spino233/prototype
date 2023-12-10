package it.spino.sample.sampleapi.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
public class SampleDTO {
    private long id;
    private String name;
    private String surname;
    private String age;
    private boolean _deleted;
    private long updatedAt;
    private String _rev;
}
