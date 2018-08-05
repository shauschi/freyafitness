package freya.fitness.api.dto;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import lombok.Data;

@Data
public class StatisticDto {

    private UUID userId;
    private UUID favouriteCourseTypeId;
    private Long favouriteCourseParticipations;
    private Map<LocalDate, Long> participationsPerMonth = Collections.emptyMap();

}
