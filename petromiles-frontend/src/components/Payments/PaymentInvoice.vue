<template>
  <client-layout>
    <!-- Pdf generation options-->
    <vue-html2pdf
      :show-layout="false"
      :enable-download="false"
      :preview-modal="false"
      :paginate-elements-by-height="1400"
      :filename="`petromiles[${$t(`invoice.invoice`)}]-${date}`"
      :pdf-quality="2"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="800px"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section class="invoice-container" slot="pdf-content">
        <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="2">
                <!-- Header -->
                <table>
                  <tr>
                    <td>
                      <span class="invoice-title">
                        {{
                        $t("invoice.invoice")
                        }}
                      </span>
                      <span class="invoice-date">&nbsp; #{{ transaction.idTransaction }}</span>
                      <br />
                      {{ date }}
                      <br />
                    </td>

                    <td class="align-right">
                      <img :src="icon" class="invoice-icon" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Company and user information-->
            <tr class="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      <span class="invoice-name">{{ $tc("role.client", 0) }}:</span>
                      {{ userFullName }}
                      <br />
                      <span class="invoice-name">{{ $t("user-details.email") }}:</span>
                      {{ user.email }}
                      <br />
                      <span class="invoice-name">{{ $tc("navbar.bankAccount", 0) }}:</span>
                      xxxx- {{ bankAccount }}
                    </td>

                    <td class="align-right">
                      PetroMiles, Inc
                      <br />Las Mercedes, Caracas
                      <br />Venezuela,1060
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Transaction amounts-->
            <tr class="info-box">
              <td colspan="2">
                <table cellpadding="0" cellspacing="0">
                  <tr class="heading center-item">
                    <td>{{ $t("invoice.transactionType") }}</td>
                    <td>{{ $t("payments.points") }}</td>
                    <td>{{ $tc("common.amount", 0) }} ($)</td>
                  </tr>

                  <tr class="item center-item invoice-table-content">
                    <td
                      class="invoice-table-content-type"
                    >{{ this.$tc(`transaction-type.${transaction.type}`) }}</td>
                    <td>{{ points }}</td>
                    <td>{{ Math.round(transaction.rawAmount) / 100 }}</td>
                  </tr>
                  <tr class="item center-item invoice-table-content">
                    <td></td>
                    <td>Subtotal:</td>
                    <td>{{ Math.round(transaction.rawAmount) / 100 }}</td>
                  </tr>
                  <tr class="item center-item invoice-table-content">
                    <td></td>
                    <td>{{ $t("invoice.taxes") }} ({{ Math.round(tax * 100) / 100 }}):</td>
                    <td>{{ total }}</td>
                  </tr>
                  <tr class="total center-item">
                    <td></td>
                    <td></td>
                    <td>
                      <span class="invoice-name">{{ $t("common.total") }}:</span>
                      $ {{ total }}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </section>
    </vue-html2pdf>
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import VueHtml2pdf from "vue-html2pdf";
import { mapState } from "vuex";

import PetromilesIcon from "@/../public/img/icons/mstile-148x148.png";

export default {
  components: {
    VueHtml2pdf,
    "client-layout": ClientLayout,
  },
  props: {
    transaction: { type: Object },
    typeInvoice: String,
  },
  data() {
    return {
      icon: PetromilesIcon,
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    date: function() {
      const date = new Date();
      return (
        date.getDate() +
        "/" +
        date.getMonth() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    },
    userFullName: function() {
      return this.user.details.firstName + " " + this.user.details.lastName;
    },
    bankAccount: function() {
      return this.transaction.clientBankAccount.bankAccount.accountNumber.substr(
        -4
      );
    },
    points: function() {
      return (
        this.transaction.rawAmount /
        this.transaction.pointsConversion.onePointEqualsDollars /
        100
      );
    },
    tax: function() {
      const thirdPartyInterest = this.transaction.thirdPartyInterest
        .amountDollarCents;
      const platformInterest =
        this.transaction.platformInterest.percentage *
        this.transaction.rawAmount;

      return (
        ((thirdPartyInterest + platformInterest) / 100) *
        this.transaction.operation
      );
    },
    total: function() {
      return (
        Math.round((this.transaction.rawAmount / 100 + this.tax) * 100) / 100
      );
    },
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },

    hasGenerated(blob) {
      this.$emit("pdfWasCreated");
      var formData = new FormData();
      formData.append(
        "file",
        blob,
        `petromiles[${this.$tc("invoice.invoice")}]-${this.date}`
      );
      this.$http.post(
        `/payments/${this.typeInvoice}/invoice/${this.points}/${this.total}`,
        formData
      );
    },
  },
  mounted() {
    this.generateReport();
  },
};
</script>

<style scoped>
.invoice-container {
  width: 100%;
  margin-top: 100px;
  margin-left: 100px;
  margin-right: 100px;
}
.invoice-title {
  font-weight: bold;
  font-size: 28px;
}
.invoice-date {
  font-size: 20px;
}
.invoice-icon {
  width: 50%;
  max-width: 70px;
}
.invoice-name {
  font-weight: bold;
}
.invoice-table-content {
  height: 50px;
  padding-top: 10px;
}
.invoice-table-content-type {
  text-transform: uppercase;
}
.invoice-box {
  width: 100%;
  margin-left: 10%;
  padding: 30px 40px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 17px;
  line-height: 24px;
  font-family: "Helvetica Neue";
}
.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}
.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}
.center-item {
  text-align: center;
}
.align-right {
  text-align: right;
}
.total td:nth-child(2) {
  text-align: right;
}
.total td:nth-child(2) span {
  font-size: 20px;
}
.invoice-box table tr.top table td {
  padding-bottom: 10px;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}
.invoice-box table tr.heading td {
  background: #1b3d6e;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  color: rgb(255, 250, 250);
}
.invoice-box table tr.item td {
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>
