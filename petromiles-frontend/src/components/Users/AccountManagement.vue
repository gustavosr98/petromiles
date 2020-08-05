<template>
  <div>
    <br />
    <v-divider></v-divider>
    <br />
    <h3 class="text-center">Account Management</h3>
    <p class="text-center">Cierra tu cuenta de usuario permanentemente.</p>

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="11" md="9" class="ml-4 mb-8">
        <p class="mb-0 pb-0">Cierra tu cuenta</p>
        <p class="mt-0 pt-0">
          <strong>Advertencia:</strong> Si cierras tu cuenta, se cancelará tu suscripción en PetroMiles y perderás el acceso para siempre.
        </p>
        <v-checkbox v-model="deleteUserData" :label="checkBoxMessage"></v-checkbox>
        <v-btn outlined color="indigo">Cerrar cuenta</v-btn>
      </v-col>

      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      deleteUserData: false,
      checkBoxMessage:
        "I want to close my account and delete all my information",
    };
  },
};
</script>