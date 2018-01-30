package freya.fitness.domain;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
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
