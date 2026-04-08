<?php
/**
 * VibeBuy Order Modal Template
 * 
 * This template can be overridden by copying it to your-theme/vibebuy/order-modal.php
 * 
 * IMPORTANT: Do not remove the ID attributes starting with "vibe-slot-".
 * These are used by React to inject dynamic content and form fields.
 *
 * @package VibeBuy
 */

if (!defined('ABSPATH')) {
	exit;
}
?>
<div class="vibebuy-modal-overlay p-4 md:p-6" id="vibe-modal-overlay">
	<div class="vibebuy-modal-content animate-in zoom-in-95 duration-200 overflow-hidden"
		style="max-width: 780px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; padding: 0; border-radius: 16px;">

		<!-- Close Button Slot -->
		<div id="vibe-slot-close"></div>

		<div class="flex flex-col md:flex-row h-full overflow-hidden">
			<!-- Left Column: Product Image -->
			<div
				class="w-full md:w-[35%] bg-gray-50 border-r border-gray-100 flex items-center justify-center overflow-hidden relative">
				<div id="vibe-slot-image" class="w-full h-full"></div>
			</div>

			<!-- Right Column: Form & Info -->
			<div class="w-full md:w-[65%] flex flex-col h-full bg-white relative overflow-hidden">
				<div class="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar" style="max-height: calc(90vh - 20px);">

					<!-- Product Header -->
					<div class="mb-5">
						<div class="mb-1" id="vibe-slot-product-sku"></div>
						<h3 id="vibe-slot-product-name" class="mb-0.5"></h3>
						<div id="vibe-slot-product-price"></div>
						<div id="vibe-slot-variation-selector"></div>
					</div>

					<!-- Quantity Section -->
					<div class="mb-5">
						<div id="vibe-slot-quantity" class="flex items-center"></div>
					</div>

					<!-- Form Section -->
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div id="vibe-slot-field-firstname"></div>
							<div id="vibe-slot-field-lastname"></div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div id="vibe-slot-field-email"></div>
							<div id="vibe-slot-field-phone"></div>
						</div>

						<div id="vibe-slot-field-message" class="opacity-100"></div>
						<div class="pt-2">
							<div id="vibe-slot-submit"></div>
						</div>
					</div>

					<!-- Success Message (Initially Hidden/Managed by React) -->
					<div id="vibe-slot-success"></div>

					<!-- Branding -->
					<div id="vibe-slot-branding"></div>
				</div>
			</div>
		</div>
	</div>
</div>