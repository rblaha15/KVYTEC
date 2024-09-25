import com.google.cloud.tools.gradle.appengine.appyaml.AppEngineAppYamlExtension

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlinx.serialization)
    id("com.gradleup.shadow") version "8.3.1"
    id("com.google.cloud.tools.appengine") version "2.8.0"
}

group = "cz.regulus"
version = "0.0.1"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")

    val isDevelopment = true//project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

java {
    sourceCompatibility = JavaVersion.VERSION_1_8
    targetCompatibility = JavaVersion.VERSION_1_8
}

kotlin {
    jvmToolchain(8)
}

ktor {
    fatJar {
        archiveFileName.set("ekonomicke-zhodnoceni-tc.jar")
    }
}

configure<AppEngineAppYamlExtension> {
    stage {
        setArtifact("build/libs/ekonomicke-zhodnoceni-tc.jar")
    }
    deploy {
        version = "dev"
        projectId = "ekonomicke-zhodnoceni-tc"
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.sessions)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.config.yaml)
    implementation("org.apache.poi:poi:5.2.3")
    @Suppress("VulnerableLibrariesLocal", "RedundantSuppression")
    implementation("org.apache.poi:poi-ooxml:5.2.3")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.2")
    
}
