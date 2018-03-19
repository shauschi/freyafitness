package freya.fitness.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

  @PutMapping("/loginwithfacebook")
  public ResponseEntity<?> login() {
    return ResponseEntity.ok("Test");
  }

  @PutMapping("/logout")
  public ResponseEntity<String> logout() {
    return ResponseEntity.ok("Bis bald");
  }

}
