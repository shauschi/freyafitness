package freya.fitness.proxy;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateEmail {

  private final String templateId;
  private final Map<String, String> parameters;

  private final List<String> to;
  private final List<String> cc;
  private final List<String> bcc;

}
