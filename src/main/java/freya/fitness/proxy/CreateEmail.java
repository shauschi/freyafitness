package freya.fitness.proxy;

import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateEmail {

  private String templateId;
  private Map<String, String> parameters;

  private List<String> to;
  private List<String> cc;
  private List<String> bcc;

  public CreateEmail(final String templateId) {
    this.templateId = templateId;
  }

}
