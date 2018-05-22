package freya.fitness.api.dto;

import freya.fitness.domain.jpa.News;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class NewsDto {

  private UUID id;
  private String title;
  private String teaser;
  private String text;
  private Long pictureId;
  private ValidityDto validity;

  public NewsDto(final News news) {
    this.id = news.getId();
    this.title = news.getTitle();
    this.teaser = news.getTeaser();
    this.text= news.getText();
    this.pictureId = news.getPictureId();
    this.validity = new ValidityDto(news.getValidity());
  }
}
