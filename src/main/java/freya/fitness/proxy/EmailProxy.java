package freya.fitness.proxy;

import freya.fitness.api.dto.MessageDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient(name = "Email", url = "http://localhost:7700")
public interface EmailProxy {

  @RequestMapping("/emails")
  MessageDto createEmail(@RequestBody final CreateEmail createEmail);

}