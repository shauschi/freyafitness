package freya.fitness.domain.jpa;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "news", schema="public")
public class News extends BusinessObject {

  private String title;

  private String teaser;

  private String text;

  private Long pictureId;

}
