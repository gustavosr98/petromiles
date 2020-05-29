<template>
  <div class="user">
    <div class="perfil">
      <figure class="perfil-circle">
        <div v-if="photoUser">
          <v-img :src="photoUser" />
        </div>
        <div v-else>
          <v-img :src="require('../../../assets/perfil.jpg')" />
        </div>
      </figure>
      <h1 class="perfil-name">{{ firstName }} {{ lastName }}</h1>
    </div>
    <h2>{{ $t("user-details.yourProfile") }}</h2>
    <div class="user-details">
      <div class="detail">
        <b>{{ $t("user-details.firstName") }}</b>
        <br />
        {{ firstName }}
        <hr />
        <br />
        <b>{{ $t("user-details.middleName") }}</b>
        <br />
        {{ middleName }}
        <hr />
        <br />
        <b>{{ $t("user-details.email") }}</b>
        <br />
        {{ email }}
        <hr />
        <br />
        <b>{{ $t("user-details.phone") }}</b>
        <br />
        {{ phone }}
        <hr />
      </div>
      <div class="detail">
        <b>{{ $t("user-details.lastName") }}</b>
        <br />
        {{ lastName }}
        <hr />
        <br />
        <b>{{ $t("user-details.secondLastName") }}</b>
        <br />
        {{ secondLastName }}
        <hr />
        <br />
        <b>{{ $t("user-details.address") }}</b>
        <br />
        {{ addres }}
        <hr />
        <br />
        <b>{{ $t("user-details.dateOfBirth") }} (DD/MM/YYYY)</b>
        <br />
        {{ birthdate }}
        <hr />
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "user-detail",
  data() {
    return {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      secondLastName: "",
      addres: "",
      birthdate: "",
      phone: "",
    };
  },
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  methods: {},
  mounted() {
    if (this.user) {
      this.firstName = this.user.details.firstName;
      this.lastName = this.user.details.lastName;
      this.middleName = this.user.details.middleName;
      this.secondLastName = this.user.details.secondLastName;
      this.phone = this.user.details.phone;
      this.email = this.user.email;
      this.addres = this.user.details.addres;
      this.birthdate = this.user.details.birthdate;
    }
  },
  computed: {
    ...mapState("auth", ["user"]),
    photoUser() {
      if (!this.user) return false;

      return this.user.details.photo;
    },
  },
};
</script>
<style lang="scss" scoped>
.user {
  box-sizing: border-box;
}
.perfil-circle {
  border-radius: 50%;
  width: 100px;
  overflow: hidden;
  margin: 0;
  height: 100px;
}
.perfil-photo {
  width: 100%;
}
.perfil-name {
  font-size: 20px;
  margin-left: 0.5em;
  width: 250px;
}

.perfil-name,
.perfil-circle {
  display: inline-block;
  vertical-align: middle;
}
.user-details {
  margin-left: 35px;
  padding: 1em;
  display: table;
}
.detail {
  display: table-cell;

  padding-left: 100px;
}
b,
h2 {
  color: blue;
}
</style>
