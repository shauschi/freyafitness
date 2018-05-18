package freya.fitness.dto;

import freya.fitness.domain.jpa.News;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class NewsPreviewDto {

  private UUID id;
  private String title;
  private String teaser;
  private Long pictureId;

  public NewsPreviewDto(final News news) {
    this.id = news.getId();
    this.title = news.getTitle();
    this.teaser = news.getTeaser();
    this.pictureId = news.getPictureId();
  }
}
