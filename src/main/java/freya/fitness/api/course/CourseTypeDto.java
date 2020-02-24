package freya.fitness.api.course;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseTypeDto {

  private UUID id;
  private String name;
  private String description;
  private String color;

  public CourseTypeDto(final CourseType courseType) {
    this.id = courseType.getId();
    this.name = courseType.getName();
    this.description = courseType.getDescription();
    this.color = courseType.getColor();
  }
}
