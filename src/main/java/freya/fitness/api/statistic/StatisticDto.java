package freya.fitness.api.statistic;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import lombok.Data;

@Data
public class StatisticDto {

  private UUID userId;
  private Map<UUID, Long> participationsPerType;
  private Map<LocalDate, Long> participationsPerMonth = Collections.emptyMap();

}
