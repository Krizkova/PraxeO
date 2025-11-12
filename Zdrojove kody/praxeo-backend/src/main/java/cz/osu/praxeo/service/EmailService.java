package cz.osu.praxeo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("praxeo@seznam.cz");
        message.setTo(to);
        message.setSubject("PraxeO – potvrďte registraci");
        message.setText("""
            Dobrý den,
            
            dokončete prosím registraci kliknutím na tento odkaz:
            """ + link + """

            Odkaz je platný 24 hodin.
            Tým PraxeO
            """);

        mailSender.send(message);
    }

}
