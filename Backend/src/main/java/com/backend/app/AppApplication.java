package com.backend.app;

import com.backend.app.services.UmfrageService;
import com.backend.app.services.UnternehmenService;
import com.backend.app.shared.ExcelReader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class AppApplication implements CommandLineRunner{
	private final Environment environment;

	public AppApplication(Environment environment) {
		this.environment = environment;
	}

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

	@Override
	public void run(String... args) {
		ExcelReader.insertData(new String[]{this.environment.getProperty("umfrage.excel.path"), this.environment.getProperty("unternehmen.excel.path")});
	}
}
