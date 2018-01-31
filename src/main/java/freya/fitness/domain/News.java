package freya.fitness.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "news", schema="public")
public class News extends BusinessObject {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  private String teaser;

  private String text;

  private Long pictureId;

}
