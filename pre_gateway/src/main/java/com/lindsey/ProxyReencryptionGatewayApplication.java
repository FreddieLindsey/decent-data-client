package com.lindsey;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class ProxyReencryptionGatewayApplication extends Application<ProxyReencryptionGatewayConfiguration> {

    public static void main(final String[] args) throws Exception {
        new ProxyReencryptionGatewayApplication().run(args);
    }

    @Override
    public String getName() {
        return "ProxyReencryptionGateway";
    }

    @Override
    public void initialize(final Bootstrap<ProxyReencryptionGatewayConfiguration> bootstrap) {
        // TODO: application initialization
    }

    @Override
    public void run(final ProxyReencryptionGatewayConfiguration configuration,
                    final Environment environment) {
        // TODO: implement application
    }

}
