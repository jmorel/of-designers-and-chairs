<template>
    <div>
        <header>
            <h1>Of Designers and Chairs</h1>
            <hr>
            <navigation v-bind:current-designer="currentDesigner"></navigation>
        </header>

        <main>
            <chairs v-bind:current-designer="currentDesigner"></chairs>
        </main>

        <footer>
            <p><em>Of Designers and chairs</em>, yet another somewhat useless project of <a href="http://hexagonal.io">Jérémy Morel</a>.</p>
            <p>Questions? Remarks? <a href="mailto:jeremy@hexagonal.io">Write</a> or <a href="https://twitter.com/jmorel_fr">Tweet</a>                me.</p>
            <p><a href="https://jmorel.opendatasoft.com/explore/dataset/of-designers-and-chairs/">Source data</a></p>
        </footer>
    </div>
</template>

<script>
import Navigation from './Navigation.vue';
import Chairs from './Chairs.vue';

export default {
    data: () => {
        return {
            currentDesigner: decodeURIComponent(window.location.hash.substr(1))
        }
    },
    components: {
        Navigation,
        Chairs
    }
}
</script>