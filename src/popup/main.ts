import { mount } from "svelte";
import PopupApp from "./popup-app.svelte";
import TestPage from "../routes/test/+page.svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Popup mount target #app not found");

const path = window.location.pathname;
const RootComponent = path === "/test" ? TestPage : PopupApp;

mount(RootComponent, { target });
