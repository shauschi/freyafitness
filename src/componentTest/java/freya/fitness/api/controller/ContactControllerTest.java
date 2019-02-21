package freya.fitness.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import freya.fitness.api.dto.ContactDto;
import freya.fitness.service.ContactService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ContactController.class)
@AutoConfigureMockMvc(secure = false)
class ContactControllerTest {

  @MockBean
  private ContactService contactService;

  @Autowired
  private ObjectMapper mapper;

  @Autowired
  private MockMvc mvc;

  @Test
  void shouldPassContactRequestToService() throws Exception {
    // given
    final ContactDto contactDto = givenContactDto();
    final String json = mapper.writeValueAsString(contactDto);

    // when + then
    mvc.perform(post("/contact")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message")
            .value("Deine Nachricht wurde erfolgreich verschickt."));
    verify(contactService).sendContactRequest(contactDto);
    verifyNoMoreInteractions(contactService);
  }

  @Test
  void shouldNotAcceptContactRequestWithoutName() throws Exception {
    // given
    final ContactDto contactDto = givenContactDto();
    contactDto.setFirstname("");
    final String json = mapper.writeValueAsString(contactDto);

    // when + then
    mvc.perform(post("/contact")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest());
    verifyNoMoreInteractions(contactService);
  }

  @Test
  void shouldNotAcceptContactRequestWithInvalidEmail() throws Exception {
    // given
    final ContactDto contactDto = givenContactDto();
    contactDto.setEmail("invalid");
    final String json = mapper.writeValueAsString(contactDto);

    // when + then
    mvc.perform(post("/contact")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isBadRequest());
    verifyNoMoreInteractions(contactService);
  }

  @Test
  void shouldReturnErrorMessageWhenSendingMailFails() throws Exception {
    // given
    final ContactDto contactDto = givenContactDto();
    final String json = mapper.writeValueAsString(contactDto);
    doThrow(new RuntimeException("Foo"))
        .when(contactService).sendContactRequest(contactDto);

    // when + then
    mvc.perform(post("/contact")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.message")
            .value("Deine Nachricht konnte nicht verarbeitet werden."
                + " Bitte versuche es später erneut."));
    verify(contactService).sendContactRequest(contactDto);
    verifyNoMoreInteractions(contactService);
  }

  private ContactDto givenContactDto() {
    ContactDto contactDto = new ContactDto();
    contactDto.setFirstname("Tobi");
    contactDto.setLastname("Tester");
    contactDto.setEmail("contact@tobi.tester");
    contactDto.setSubject("This test is awesome");
    contactDto.setMessage("I wish there were more tests.");
    return contactDto;
  }

}