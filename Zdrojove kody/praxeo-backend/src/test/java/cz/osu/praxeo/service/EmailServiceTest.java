package cz.osu.praxeo.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailServiceTest")
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    // sendVerificationEmail

    @DisplayName("sendVerificationEmail – správný příjemce a odesílatel")
    @Test
    void sendVerificationEmail_sendsToCorrectRecipient() {
        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        emailService.sendVerificationEmail("student@osu.cz", "http://link");

        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();
        assertArrayEquals(new String[]{"student@osu.cz"}, sent.getTo());
        assertEquals("praxeo@seznam.cz", sent.getFrom());
        assertTrue(sent.getText().contains("http://link"));
    }

    @DisplayName("sendVerificationEmail – správný subject")
    @Test
    void sendVerificationEmail_containsCorrectSubject() {
        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        emailService.sendVerificationEmail("student@osu.cz", "http://link");

        verify(mailSender).send(captor.capture());
        assertEquals("PraxeO – potvrďte registraci", captor.getValue().getSubject());
    }

    @DisplayName("sendVerificationEmail – volá mailSender právě jednou")
    @Test
    void sendVerificationEmail_callsMailSenderExactlyOnce() {
        emailService.sendVerificationEmail("student@osu.cz", "http://link");

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    //  sendPasswordResetEmail

    @DisplayName("sendPasswordResetEmail – správný příjemce a odesílatel")
    @Test
    void sendPasswordResetEmail_sendsToCorrectRecipient() {
        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        emailService.sendPasswordResetEmail("ucitel@osu.cz", "http://reset-link");

        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();
        assertArrayEquals(new String[]{"ucitel@osu.cz"}, sent.getTo());
        assertEquals("praxeo@seznam.cz", sent.getFrom());
        assertTrue(sent.getText().contains("http://reset-link"));
    }

    @DisplayName("sendPasswordResetEmail – správný subject")
    @Test
    void sendPasswordResetEmail_containsCorrectSubject() {
        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        emailService.sendPasswordResetEmail("ucitel@osu.cz", "http://reset-link");

        verify(mailSender).send(captor.capture());
        assertEquals("PraxeO – dokončete obnovení hesla", captor.getValue().getSubject());
    }

    @DisplayName("sendPasswordResetEmail – volá mailSender právě jednou")
    @Test
    void sendPasswordResetEmail_callsMailSenderExactlyOnce() {
        emailService.sendPasswordResetEmail("ucitel@osu.cz", "http://reset-link");

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}