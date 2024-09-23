// apollo.config.js
module.exports = {
    client: {
        service: {
            name: "vue-apollo-quasar-login",
            // URL to the GraphQL API
            url: "https://app.stud.druid.1t.ru/graphql",
        },
        // Files processed by the extension
        includes: ["src/**/*.vue", "src/**/*.js"],
    },
};
