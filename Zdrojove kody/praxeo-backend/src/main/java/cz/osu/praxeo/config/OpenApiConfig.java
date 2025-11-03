package cz.osu.praxeo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI praxeoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PraxeO API")
                        .description("REST API pro správu uživatelů a praxí")
                        .version("1.0.0"));
    }
}
