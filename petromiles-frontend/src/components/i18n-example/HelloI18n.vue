<template>
  <div>
    <!-- This "hello" only works from <i18n>. Use only to test out -->
    <p>LOCAL FILE. USE THIS ONLY FOR LOCAL DEVELOPMENT.</p>
    <p>{{ $t("hello") }}</p>

    <!-- IMPORTANT! This comes from our backend. Use i18n in this way -->
    <p>SINGULARS</p>
    <p>{{ $t("navbar.dashboard") }}</p>

    <!-- If it has plurals. It should be first registered on POEditor Dashboard -->
    <p>WHEN THE WORD HAS PLURALS</p>
    <p>{{ $tc("navbar.bankAccount") }}</p>
    <p>{{ $tc("navbar.bankAccount", 10, { count: 10 }) }}</p>
  </div>
</template>

<script>
export default {
  name: "hello-i18n",
};
</script>

<!-- IMPORTANT! <i18n> only works locally. Use only to test out -->
<i18n>
{
  "en": {
    "hello": "Hello i18n from local file"
  }
}
</i18n>
