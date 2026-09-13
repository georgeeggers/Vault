<script>


</script>

<div class="ghost">

</div>


<style>

    @property --angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    .ghost {
        width: 100%;
        height: 100%;
        display: flex;
        background-size: 400% 400%;
        background-image: linear-gradient(to right, var(--bg2), var(--bg3), var(--bg2));
        animation: 3s bleh ease-in-out infinite;
    }

    @keyframes bleh {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }

    }


</style>