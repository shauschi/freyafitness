package freya.fitness.domain.jpa;

import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "news", schema="public")
public class News extends BusinessObject {

  private String title;

  private String teaser;

  private String text;

  private Long pictureId;

}
