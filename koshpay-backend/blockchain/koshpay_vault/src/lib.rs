use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Placeholder ID, change after deploy

#[program]
pub mod koshpay_vault {
    use super::*;

    // 1. Initialize the Vault (Set Authority)
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vault_state = &mut ctx.accounts.vault_state;
        vault_state.authority = ctx.accounts.authority.key();
        msg!("KoshPay Vault Initialized. Authority: {}", vault_state.authority);
        Ok(())
    }

    // 2. Deposit SOL into Vault
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let depositor = &ctx.accounts.depositor;
        let vault = &mut ctx.accounts.vault_account; // Using System Account as PDA wallet
        
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: depositor.to_account_info(),
                to: vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        emit!(DepositEvent {
            user: depositor.key(),
            amount: amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Deposited {} lamports from {}", amount, depositor.key());
        Ok(())
    }

    // 3. Withdraw SOL (Only Authority)
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault_account;
        let recipient = &mut ctx.accounts.recipient;
        
        // Transfer from PDA to recipient
        // Since PDA "owns" the lamports but logic is in program, we can't CPI transfer normally from PDA 
        // without seeds. We transfer by deducting lamports directly if PDA is owned by program, 
        // OR standard approach: close account / subtract lamports manually if owned by SystemProgram (which it is if it's just a PDA).
        
        // Standard Anchor PDA transfer logic:
        **vault.try_borrow_mut_lamports()? -= amount;
        **recipient.try_borrow_mut_lamports()? += amount;

        msg!("Withdrawn {} lamports to {}", amount, recipient.key());
        Ok(())
    }
}

// ACCOUNT VALIDATION STRUCTS

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = authority, 
        space = 8 + 32,
        seeds = [b"state"], 
        bump
    )]
    pub vault_state: Account<'info, VaultState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,
    
    /// CHECK: This is the PDA wallet where funds are stored. Safe because we derive it.
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub vault_account: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        has_one = authority // Ensure signer matches stored authority
    )]
    pub vault_state: Account<'info, VaultState>,
    
    #[account(mut)]
    pub authority: Signer<'info>, // Backend Keypair

    /// CHECK: The vault PDA
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub vault_account: AccountInfo<'info>,

    /// CHECK: Recipient can be any address
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

// STATE STRUCTS
#[account]
pub struct VaultState {
    pub authority: Pubkey,
}

// EVENTS
#[event]
pub struct DepositEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}
