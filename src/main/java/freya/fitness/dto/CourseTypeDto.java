package freya.fitness.dto;

import freya.fitness.domain.jpa.CourseType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseTypeDto {

  private String id;
  private String name;
  private String description;
  private String color;

  public CourseTypeDto(CourseType courseType) {
    this.id = courseType.getId();
    this.name = courseType.getName();
    this.description = courseType.getDescription();
    this.color = courseType.getColor();
  }
}
