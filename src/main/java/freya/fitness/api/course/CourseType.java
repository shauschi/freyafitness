package freya.fitness.api.course;

import freya.fitness.api.common.BusinessObject;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(
    name = "course_type",
    schema="public",
    uniqueConstraints = @UniqueConstraint(columnNames = {"name"})
)
public class CourseType extends BusinessObject {

  @NotNull
  private String name;

  private String description;

  @NotNull
  @Pattern(regexp = "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})")
  private String color;

}
