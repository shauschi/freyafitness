package freya.fitness.proxy;

import freya.fitness.api.dto.MessageDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "Email", url = "${mail.url}")
public interface EmailProxy {

  @RequestMapping(
      method = RequestMethod.POST,
      value = "/emails",
      consumes = "application/json",
      produces = "application/json"
  )
  MessageDto createEmail(@RequestBody final CreateEmail createEmail);

}